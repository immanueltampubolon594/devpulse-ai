package main

import (
	"fmt"
	"github.com/immanueltampubolon594/devpulse/internal/config"
	"github.com/immanueltampubolon594/devpulse/internal/handler"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Konfigurasi (Mendukung .env di laptop dan Environment Variables di Railway)
	cfg := config.LoadConfig()

	// 2. Inisialisasi Database (SQLite CGO-Free buat Windows/Linux)
	config.InitDB()

	// 3. Setup Gin Router
	r := gin.Default()

	// 4. Middleware CORS (SANGAT PENTING: Agar Frontend Vercel diizinkan mengambil data)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 5. Routes (Jalur Komunikasi Sistem)

	// [PINTU DEPAN] Agar link Railway tidak 404 lagi saat dibuka browser
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"project": "DevPulse AI Code Reviewer",
			"engine":  "Go (Golang)",
			"status":  "Operational / Healthy",
			"author":  "Immanuel Tampubolon",
			"version": "1.0.0",
		})
	})

	// [HEALTH CHECK] Jalur testing sederhana
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "DevPulse Dashboard API is Ready!"})
	})
	
	// [GITHUB WEBHOOK] Jalur masuk data Pull Request dari Amerika
	r.POST("/webhook", handler.HandleWebhook) 

	// [DASHBOARD API] Jalur untuk mensuplai data ke Dashboard Next.js lo
	r.GET("/api/reviews", handler.GetReviews) 

	// 6. Jalankan Server
	// Railway akan memberikan nomor PORT secara dinamis melalui cfg.Port
	fmt.Printf("DevPulse Engine is running on port %s\n", cfg.Port)
	r.Run(":" + cfg.Port)
}