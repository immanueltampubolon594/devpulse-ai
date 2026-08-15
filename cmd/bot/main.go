package main

import (
	"fmt"
	"github.com/immanueltampubolon594/devpulse/internal/config"
	"github.com/immanueltampubolon594/devpulse/internal/handler"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Konfigurasi (.env)
	cfg := config.LoadConfig()

	// 2. Inisialisasi Database (SQLite)
	config.InitDB()

	// 3. Setup Gin Router
	r := gin.Default()

	// 4. Middleware CORS (PENTING: Biar Frontend bisa akses API ini)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 5. Routes (Jalur)
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "DevPulse Dashboard API is Ready!"})
	})
	
	r.POST("/webhook", handler.HandleWebhook) // Jalur dari GitHub
	r.GET("/api/reviews", handler.GetReviews) // Jalur untuk Dashboard lo nanti

	// 6. Jalankan Server
	fmt.Printf("DevPulse Server jalan di port %s\n", cfg.Port)
	r.Run(":" + cfg.Port)
}