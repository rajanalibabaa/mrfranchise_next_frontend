"use client";

import { motion } from "framer-motion";
import { Badge, Button, Tooltip } from "@mui/material";
import { useMotionValue } from "framer-motion";
import Compare from "@mui/icons-material/Compare";


const CompareFloatingButton = ({
  selectedForComparison,
  handleCompareClick
}) => {


  const x = useMotionValue(0);
  const y = useMotionValue(200);


  return (

    <motion.div

      drag

      dragMomentum={false}

      dragElastic={0.2}

      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 70,
        bottom: window.innerHeight - 80,
      }}

      style={{
        position:"fixed",
        zIndex:9999,

        x,
        y,

        cursor:"grab",
      }}


    >


      <Badge
        badgeContent={selectedForComparison.length}
        color="primary"
      >


        <Tooltip
          title="Compare brands"
          placement="left"
          arrow
        >


          <Button

            variant="contained"

            startIcon={<Compare />}

            onClick={handleCompareClick}


            sx={{

              transform:"rotate(-90deg)",

              transformOrigin:"right center",

              borderRadius:2,

              boxShadow:3,

              bgcolor:"#ff9800",

              "&:hover":{
                bgcolor:"#fb8c00"
              }

            }}


          >

            Compare

          </Button>


        </Tooltip>


      </Badge>


    </motion.div>


  );

};


export default CompareFloatingButton;