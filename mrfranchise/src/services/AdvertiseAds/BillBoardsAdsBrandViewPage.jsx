import { Box, Card, CardMedia } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import banner assets
import img1 from "../../assets/Images/logo.png";      
import img2 from "../../assets/Images/logo.png"; // assuming it's image
import img3 from "../../assets/Images/logo.png";

export default function BillboardAd() {
  const slides = [
    { type: "image", src: img1, link: "https://example1.com" },
    { type: "image", src: img2, link: "https://example2.com" }, // treat as image
    { type: "image", src: img3, link: "https://example3.com" },
    // If you actually have a video:
    // { type: "video", src: "/assets/video.mp4", link: "https://video-ad.com" }
  ];

  return (
    <Box
      sx={{
        
        maxWidth: 800,
        mx: "auto",
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation
        style={{
          width: "100%",
          height: "290px", // Billboard height
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Card
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <a href={slide.link} target="_blank" rel="noopener noreferrer">
                {slide.type === "image" ? (
                  <CardMedia
                    component="img"
                    loading="lazy"
                    image={slide.src}
                    alt={`Billboard Ad ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
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