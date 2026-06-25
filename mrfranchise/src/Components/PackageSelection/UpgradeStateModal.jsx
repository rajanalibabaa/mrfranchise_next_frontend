import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Button, Checkbox, FormControlLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UpgradeStateModal = ({ openStateModal, setOpenStateModal, currentEditingRange, currentRangeStates, blockedStates, selectedStates, setSelectedStates, handleSaveStatesFromModal, COLORS, TEXT_SIZES, isMobile }) => {
  return (
    <Dialog open={openStateModal} onClose={() => setOpenStateModal(false)} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3, mx: isMobile ? 2 : "auto", maxHeight: "90vh", overflow: "hidden" } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, backgroundColor: COLORS?.grey?.[50] || "#f5f5f5", borderBottom: `1px solid ${COLORS?.border || "#e0e0e0"}` }}>
        <Typography fontWeight={700} fontSize={TEXT_SIZES?.medium || "1rem"} color={COLORS?.black || "#111"}>
          Select States{currentEditingRange?.range ? ` — ${currentEditingRange.range}` : ""}
        </Typography>
        <IconButton size="small" onClick={() => setOpenStateModal(false)}>
          <CloseIcon fontSize="small" sx={{ color: COLORS?.grey?.[500] || "#9e9e9e" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1, overflowY: "auto" }}>
        <Box sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button size="small" variant="outlined" onClick={() => { const selectable = (currentRangeStates ?? []).filter((s) => !blockedStates.has(s)); setSelectedStates(new Set(selectable)); }}>
            Select All ({(currentRangeStates ?? []).filter((s) => !blockedStates.has(s)).length})
          </Button>
          <Button size="small" variant="outlined" onClick={() => setSelectedStates(new Set())} sx={{ color: COLORS?.grey?.[600] || "#757575" }}>Clear All</Button>
        </Box>

        {(() => {
          const pool = currentRangeStates ?? [];
          if (pool.length === 0) return <Typography color="text.secondary" textAlign="center" py={4}>No states available for this range.</Typography>;
          return (
            <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(2, 1fr)", gap: 1, p: 1 }}>
              {pool.map((state) => {
                const isSelected = selectedStates.has(state);
                return (
                  <FormControlLabel key={state} control={
                    <Checkbox checked={isSelected} onChange={(e) => { const ns = new Set(selectedStates); e.target.checked ? ns.add(state) : ns.delete(state); setSelectedStates(ns); }}
                      size="small" sx={{ color: COLORS?.primary || "#1976d2", "&.Mui-checked": { color: COLORS?.secondary || "#9c27b0" } }} />
                  } label={<Typography fontSize={TEXT_SIZES?.small || "0.875rem"} color={COLORS?.black || "#111"}>{state}</Typography>} />
                );
              })}
            </Box>
          );
        })()}
      </DialogContent>

      <DialogContent sx={{ px: 2, pb: 2, borderTop: `1px solid ${COLORS?.border || "#e0e0e0"}`, backgroundColor: COLORS?.grey?.[50] || "#f5f5f5" }}>
        <Button variant="contained" size="small" color="primary" onClick={handleSaveStatesFromModal} fullWidth={isMobile} sx={{ minWidth: 120 }}>Save States</Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeStateModal;