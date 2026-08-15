package config

import (
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	Port          string
	WebhookSecret string
}

func LoadConfig() *Config {
	_ = godotenv.Load() 
	return &Config{
		Port:          getEnv("PORT", "8080"),
		WebhookSecret: getEnv("GITHUB_WEBHOOK_SECRET", "rahasia123"),
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}