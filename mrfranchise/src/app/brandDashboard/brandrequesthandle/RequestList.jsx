"use client";
import React, { useEffect, useMemo, useCallback, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequestById,
  removeRequest,
  addRealtimeRequest,
} from "@/Redux/Slices/userRequestSlice.jsx";
import io from "socket.io-client";

const RequestTable = () => {
  const dispatch = useDispatch();
  const { singleRequest, loading } = useSelector((state) => state.requests);
const [brandUUID, setBrandUUID] = useState(null);
useEffect(() => {
    const id = localStorage.getItem("brandUUID");
    setBrandUUID(id);
  }, []);
  // Socket connection
  const socket = useMemo(() => {
    if (brandUUID) {
      return io(`${process.env.NEXT_PUBLIC_API_URL}`, {
        transports: ["websocket"],
        upgrade: false,
      });
    }
    return null;
  }, [brandUUID]);

  // Handle Socket Events
  useEffect(() => {
    if (!socket || !brandUUID) return;

    socket.emit("joinBrand", brandUUID);

    const handleRealtimeUpdate = (data) => {
      // console.log("🔄 Realtime Request Update:", data);
      dispatch(addRealtimeRequest(data));
    };

    socket.on("adminNotification", handleRealtimeUpdate);
    socket.on("requestUpdated", handleRealtimeUpdate);
    socket.on("requestDeleted", () => dispatch(fetchRequestById(brandUUID)));

    return () => {
      socket.off("adminNotification", handleRealtimeUpdate);
      socket.off("requestUpdated", handleRealtimeUpdate);
      socket.off("requestDeleted");
      socket.disconnect();
    };
  }, [socket, brandUUID, dispatch]);

  // Initial Fetch
  useEffect(() => {
    if (brandUUID) dispatch(fetchRequestById(brandUUID));
  }, [dispatch, brandUUID]);

  // Manual Refresh
  const handleRefresh = () => {
    dispatch(fetchRequestById(brandUUID));
  };

  // Delete Request
  const handleDelete = useCallback(
    (uuid) => {
      if (window.confirm("Delete this request?")) dispatch(removeRequest(uuid));
    },
    [dispatch]
  );

  const requestArray = useMemo(() => {
    if (!singleRequest) return [];
    return Array.isArray(singleRequest) ? singleRequest : [singleRequest];
  }, [singleRequest]);

  return (
    <Box
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 3,
        // boxShadow: 6,
        // background: "linear-gradient(145deg, #f8faff 0%, #e6ebf3 100%)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600} color="warning">
          Brand Requests
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(90deg, #d25419bf 0%, #f5e342ff 100%)",
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress color="primary" />
        </Box>
      ) : requestArray.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          py={5}
        >
          No requests available. New requests will appear automatically.
        </Typography>
      ) : (
        <Fade in timeout={400}>
          <TableContainer
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0px 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  background: "#ffa726",
                }}
              >
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Message
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Created At
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Active{" "}
                  </TableCell>
                  {/* <TableCell sx={{ color: "white", fontWeight: 600 }}>Actions</TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {requestArray.map((req, index) => (
                  <TableRow
                    key={req.uuid}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f4f6fb",
                        transition: "0.2s",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>{req.message || "—"}</TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {req.isActive === false ? (
                          <Chip label="Solved" color="error" size="small" />
                        ) : req.isOpened ? (
                          <Chip
                            label="Under Process"
                            color="success"
                            size="small"
                          />
                        ) : req.isViewed ? (
                          <Chip label="Viewed" color="warning" size="small" />
                        ) : (
                          <Chip label="Pending" color="warning" size="small" />
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {req.isActive ? (
                        <>
                          <CheckCircleIcon color="success" /> Active
                        </>
                      ) : (
                        <>
                          <HighlightOffIcon color="error" /> Inactive
                        </>
                      )}
                    </TableCell>
                    {/* <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View">
                          <IconButton
                            color="primary"
                            onClick={() => console.log("view", req.uuid)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(req.uuid)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}
    </Box>
  );
};

export default RequestTable;
