import { Box, Card, CardMedia } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Removed Navigation
import "swiper/css";
import "swiper/css/pagination";

import img1 from "../../assets/Images/logo.png";
import img2 from "../../assets/Images/logo.png";
import img3 from "../../assets/Images/logo.png";

export default function LeaderboardAd() {
  const slides = [
    { type: "image", src: img1, link: "https://example1.com" },
    { type: "image", src: img2, link: "https://example2.com" },
    { type: "image", src: img3, link: "https://example3.com" },
  ];

  return (
    <Box
      sx={{
        maxWidth: 760,
        mx: "auto",
        borderRadius: 1,
        // bgcolor: "#fff",
        boxShadow: 3,
        overflow: "hidden",
        // p: 1,
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]} // Only Autoplay + Dots
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        style={{
          width: "100%",
          height: "110px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Card
              sx={{
                width: 768,
                height: 110,
                mx: "auto",
                // borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <a href={slide.link} target="_blank" rel="noopener noreferrer">
                {slide.type === "image" ? (
                  <CardMedia
                    component="img"
                    loading="lazy"
                    image={slide.src}
                    alt={`Leaderboard Ad ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "revert-layer",
                    }}
                  />
                ) : (
                  <CardMedia
                    component="video"
                    src={slide.src}
                    autoPlay
                    loop
                    muted
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </a>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
