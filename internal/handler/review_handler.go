package handler

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/immanueltampubolon594/devpulse/internal/config"
	"github.com/immanueltampubolon594/devpulse/internal/model"
)

func GetReviews(c *gin.Context) {
	var reviews []model.Review
	
	// 1. Ambil parameter "user" dari alamat URL (misal: ?user=immanuel)
	username := c.Query("user")

	// 2. Siapkan kueri database
	query := config.DB.Order("created_at desc")

	// 3. JIKA ada username yang dikirim, FILTER datanya!
	if username != "" {
		query = query.Where("author = ?", username)
	}

	// 4. Eksekusi ambil data
	query.Find(&reviews)

	c.JSON(http.StatusOK, reviews)
}