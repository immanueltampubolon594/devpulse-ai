package service

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
)

type GroqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func GetAIReview(diff string) (string, error) {
	apiKey := os.Getenv("AI_API_KEY")
	url := "https://api.groq.com/openai/v1/chat/completions"

	// PROMPT SAKTI: Membuat bot lo terlihat sangat profesional di mata internasional
	systemPrompt := `You are a Senior Software Engineer at a top-tier global tech company.
Review the provided code changes (diff) with high technical standards.

WAJIB berikan respon dalam format dua bahasa berikut:

1. 🇬🇧 TECHNICAL SUMMARY (English):
   - A brief, high-level summary of what the code does and its primary issues.
   
2. 🇮🇩 ULASAN DETAIL (Bahasa Indonesia):
   - Penjelasan teknis mengenai bug, celah keamanan (Security), atau saran kebersihan kode (Clean Code).

3. 💡 SUGGESTION BLOCK:
   - Jika ada baris kode yang perlu diperbaiki, WAJIB gunakan format GitHub Suggestion:
     '
     suggestion
     [KODE PERBAIKAN DI SINI]
     '

Fokus utama lo adalah: KEAMANAN (Security) dan EFISIENSI. 
Jangan bertele-tele, langsung ke intinya (Direct and Concise).`

	payload := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []interface{}{
			map[string]interface{}{
				"role":    "system",
				"content": systemPrompt,
			},
			map[string]interface{}{
				"role":    "user",
				"content": "Review this code diff:\n\n" + diff,
			},
		},
		"temperature": 0.2, // Rendah agar AI tidak "ngaco" dan tetap teknis
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var groqResp GroqResponse
	err = json.Unmarshal(body, &groqResp)
	if err != nil {
		return "Gagal mengolah data dari AI. Cek koneksi atau API Key.", nil
	}

	if len(groqResp.Choices) > 0 {
		return groqResp.Choices[0].Message.Content, nil
	}

	return "AI sedang berpikir terlalu keras. Coba kirim ulang. Response: " + string(body), nil
}