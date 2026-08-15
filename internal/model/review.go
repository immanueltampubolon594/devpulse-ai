package model

import (
	"time"
	"gorm.io/gorm"
)

type Review struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	RepoName   string         `json:"repo_name"`
	PRNumber   int            `json:"pr_number"`
	Author     string         `json:"author"`
	AIResponse string         `json:"ai_response"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}