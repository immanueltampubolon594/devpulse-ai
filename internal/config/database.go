package config

import (
	"github.com/immanueltampubolon594/devpulse/internal/model"
	"github.com/glebarez/sqlite" // <--- Pakai yang ini biar nggak error di Windows
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// Membuka database devpulse.db (otomatis kebuat kalau belum ada)
	database, err := gorm.Open(sqlite.Open("devpulse.db"), &gorm.Config{})
	if err != nil {
		// Kalau error, kasih tau apa masalahnya daripada langsung panic
		panic("Gagal koneksi ke database: " + err.Error())
	}

	// Otomatis bikin tabel berdasarkan model Review
	database.AutoMigrate(&model.Review{})
	DB = database
}