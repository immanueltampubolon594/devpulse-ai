package handler

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/go-github/v60/github"
	"github.com/immanueltampubolon594/devpulse/internal/config"
	"github.com/immanueltampubolon594/devpulse/internal/model"
	"github.com/immanueltampubolon594/devpulse/internal/service"
	"golang.org/x/oauth2"
)

func HandleWebhook(c *gin.Context) {
	// 1. Validasi Webhook Secret (Cek Kunci)
	payload, err := github.ValidatePayload(c.Request, []byte("rahasia123"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	event, err := github.ParseWebHook(github.WebHookType(c.Request), payload)
	if err != nil {
		return
	}

	switch e := event.(type) {
	case *github.PullRequestEvent:
		// Hanya jalankan jika PR dibuka atau diperbarui
		if *e.Action == "opened" || *e.Action == "synchronize" {
			owner := *e.Repo.Owner.Login
			repo := *e.Repo.Name
			prNumber := *e.PullRequest.Number

			fmt.Printf("\n--- MEREVIEW PR #%d ---\n", prNumber)

			// 2. Setup Koneksi ke GitHub
			ctx := context.Background()
			ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: os.Getenv("GITHUB_TOKEN")})
			tc := oauth2.NewClient(ctx, ts)
			client := github.NewClient(tc)

			// 3. Ambil Perubahan Kode (Diff)
			diff, _, err := client.PullRequests.GetRaw(ctx, owner, repo, prNumber, github.RawOptions{Type: github.Diff})
			if err != nil {
				fmt.Printf("Gagal ambil diff: %v\n", err)
				return
			}

			// 4. Minta Review dari AI
			fmt.Println("Sedang minta saran ke AI...")
			review, err := service.GetAIReview(string(diff))
			if err != nil {
				fmt.Printf("Error AI: %v\n", err)
				review = "Maaf, bot sedang gangguan saat menghubungi AI."
			}

			// 5. Posting Jawaban AI ke Kolom Komentar GitHub
			commentBody := fmt.Sprintf("🤖 **DevPulse AI Review**\n\n%s", review)
			comment := &github.IssueComment{Body: &commentBody}
			_, _, err = client.Issues.CreateComment(ctx, owner, repo, prNumber, comment)
			
			if err != nil {
				fmt.Printf("Gagal posting komen ke GitHub: %v\n", err)
			} else {
				fmt.Println("BERHASIL: Komentar AI sudah terbit di GitHub!")
			}

			// 6. SIMPAN KE DATABASE (Untuk Dashboard)
			newReview := model.Review{
				RepoName:   repo,
				PRNumber:   prNumber,
				Author:     owner,
				AIResponse: review,
			}

			// Menggunakan config.DB yang sudah kita buat sebelumnya
			if err := config.DB.Create(&newReview).Error; err != nil {
				fmt.Printf("Gagal simpan ke database: %v\n", err)
			} else {
				fmt.Println("DATABASE: Riwayat review berhasil disimpan.")
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}