# State Blocking System Guide

## Overview
The state blocking system prevents users from selecting the same state in the same investment range across multiple packages.

**Example:** If "Chandigarh" is selected in "EXPANSION ENGINE" → "Below 50k", then "Chandigarh" will be disabled (blocked) in "SCALE ACCELERATION" → "Below 50k".

---

## How It Works

### 1. **Data Structure** (`allPlanStatesByRange`)
```javascript
// Structure: { planId: { rangeName: [states] } }
{
  "plan-1-id": {
    "Below 50k": ["Chandigarh", "Haryana"],
    "Rs. 50k - 2 Lakhs": ["Mumbai", "Delhi"],
  },
  "plan-2-id": {
    "Below 50k": ["Punjab"],
  }
}
```

This object is built when component mounts and contains ALL states selected in ALL packages for each investment range.

### 2. **Getting Blocked States** (`getBlockedStatesForRange`)
When editing states for a package's investment range:

```javascript
getBlockedStatesForRange(currentPlanId, "Below 50k")
// Returns: Set of states already used in OTHER packages for this range
// Example: {"Chandigarh", "Haryana"} if these exist in other plans' "Below 50k"
```

### 3. **State Selection Modal**
The modal shows:
- ✅ **Selectable states**: Not used in other packages for this range
- ❌ **Blocked states**: Already used in other packages (disabled, strikethrough, tooltip)

```
[ ] Chandigarh (used in another plan)  ← DISABLED
[✓] Delhi                               ← SELECTABLE
[ ] Goa
```

---

## Key Functions

### A. `allPlanStatesByRange` (useMemo)
**Location:** ExistingPackageDisplay.jsx, line ~76

**What it does:**
- Iterates through all packages
- Extracts states for each investment range
- Groups by planId and rangeName
- Runs on mount and when `data` or `allPlans` changes

**Console output when building:**
```
🏗️  Building allPlanStatesByRange structure...
📦 Total packages: 2

  📦 Package #0: EXPANSION ENGINE (Type: LEAD)
    🔑 Plan ID: abc-123-def
    💰 Investment packages: 1
      📊 Range #0 "Below 50k": 1 states → Chandigarh
      📊 Range #1 "Rs. 50k - 2 Lakhs": 1 states → Mumbai

✅ Final allPlanStatesByRange structure:
  📦 Plan: abc-123-def
    📊 Below 50k: Chandigarh, Mumbai
```

### B. `getBlockedStatesForRange(planId, range)`
**Location:** ExistingPackageDisplay.jsx

**What it does:**
- Takes current plan ID and investment range
- Finds all states for this range in OTHER plans
- Returns them as a Set

**Console output:**
```
🔍 Calculating blocked states for range: "Below 50k", current plan: abc-123-def
📊 All plans by range: {...}
  📍 Other plan xyz-456-ghi has 2 states for range "Below 50k": ["Haryana", "Punjab"]
  📍 Other plan jkl-789-mno has 1 states for range "Below 50k": ["Himachal Pradesh"]
✅ Total blocked states for range "Below 50k": ["Haryana", "Punjab", "Himachal Pradesh"]
```

### C. `handleEditStates(planId, range, ownerPlanId, preSelected)`
**Location:** ExistingPackageDisplay.jsx

**What it does:**
1. Opens the state selection modal
2. Calls `getBlockedStatesForRange()` to get blocked states
3. Sets `blockedStates` state
4. Pre-selects current states
5. Opens modal UI

**Console output:**
```
🔓 Opening state editor for:
  📦 Plan ID: abc-123-def
  📊 Investment Range: Below 50k
  👤 Owner Plan ID: xyz-456-ghi
  ✅ Pre-selected states: 1
🚫 Setting blocked states: ["Haryana", "Punjab", "Himachal Pradesh"]
```

### D. `handleSaveStates(newStates)`
**Location:** ExistingPackageDisplay.jsx

**What it does:**
1. Saves selected states to storage
2. Updates live reference for other components
3. Warns if blocked states were accidentally selected

**Console output:**
```
💾 Saving states for range "Below 50k"
  📦 Plan ID: abc-123-def
  🔑 Storage key: abc-123-def_Below 50k
  ✅ Selected states: Chandigarh, Delhi
✅ States saved successfully
```

---

## Testing & Debugging

### Step 1: Open Browser Console (F12)

### Step 2: Run Validation Function
```javascript
window.validateStateBlocking()
```

This will output:
- All packages and their states
- Conflicting states between packages
- Data structure verification
- Plan ID matching validation

### Step 3: Check Console Logs During Edit

When you click Edit (pencil icon) on a state range:

**Check for:**
1. ✅ `🔍 Calculating blocked states...` message appears
2. ✅ Other plans are being checked
3. ✅ Correct number of blocked states returned
4. ✅ States are disabled in the modal

### Step 4: Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **States not blocked** | Run `window.validateStateBlocking()` to check if states are in `allPlanStatesByRange` |
| **Plan ID not found** | Check if `allPlans` array has matching planName. Search console for "NOT FOUND" |
| **Modal not showing blocked states** | Check if `blockedStates` is being passed to modal. Look for "✅ Setting blocked states" log |
| **Different plan IDs** | Verify package name exactly matches plan name (case-sensitive!) |

---

## Key Console Logs to Monitor

### 1. **On Component Mount**
```
🏗️  Building allPlanStatesByRange structure...
✅ Validation function available: window.validateStateBlocking()
```

### 2. **When Clicking Edit Icon**
```
🔓 Opening state editor for:
  📦 Plan ID: xxx
  📊 Investment Range: Below 50k
🚫 Setting blocked states: ["State1", "State2"]
```

### 3. **When Saving Selection**
```
💾 Saving states for range "Below 50k"
  ✅ Selected states: State1, State2
✅ States saved successfully
```

---

## Data Flow Diagram

```
Component Mount
    ↓
[Read API data with packages & states]
    ↓
Build allPlanStatesByRange {planId: {range: [states]}}
    ↓
User clicks Edit (pencil icon)
    ↓
Call handleEditStates(planId, range)
    ↓
Call getBlockedStatesForRange(planId, range)
    ↓
Filter states from OTHER plans for same range
    ↓
setBlockedStates(filtered)
    ↓
Open Modal with blocked states disabled
    ↓
User selects states (blocked ones are grayed out)
    ↓
Click Save States
    ↓
handleSaveStates(newStates)
    ↓
Update localStorage & state
    ↓
UI Updates
```

---

## Implementation Details

### State Blocking Logic (Pseudo-code)
```javascript
// For each OTHER plan
for (const otherPlanId in allPlanStatesByRange) {
  // Skip current plan
  if (otherPlanId === currentPlanId) continue;
  
  // Get states for this range in OTHER plan
  const otherStates = allPlanStatesByRange[otherPlanId][range];
  
  // Add all to blocked set
  otherStates.forEach(state => blocked.add(state));
}

// Return blocked states
return blocked;
```

### UI Rendering (in Modal)
```javascript
{available.map((state) => {
  const isBlocked = blockedStates.has(state);
  
  return (
    <Checkbox
      checked={isSelected}
      disabled={isBlocked}  // ← Key line: disables if blocked
      onChange={...}
    />
  );
})}
```

---

## Performance Notes

- `allPlanStatesByRange` is memoized (only recalculates when data/allPlans change)
- `validateStateBlocking()` function is for debugging only (doesn't affect UI)
- Blocking check is O(n) where n = number of plans (typically <10)

---

## Expected Behavior

✅ **When working correctly:**
1. Open upgrade dialog
2. Select "Edit" on an investment range
3. Some states appear grayed out with label "(used in another plan)"
4. You cannot click those grayed-out states
5. Other states can be selected freely

❌ **If NOT working:**
1. No states are grayed out (but should be)
2. Can select states that conflict with other packages
3. Console shows warnings or errors

→ Run `window.validateStateBlocking()` to diagnose

---

## Quick Debug Checklist

- [ ] Open DevTools Console (F12)
- [ ] Run `window.validateStateBlocking()`
- [ ] Check for "NOT FOUND" errors in plan ID matching
- [ ] Verify package names match plan names exactly
- [ ] Click Edit and watch console for `🔍 Calculating blocked states...`
- [ ] Confirm blocked states appear in modal as disabled
- [ ] Verify "used in another plan" message appears

---

## Example Scenario

**API Response:**
```json
{
  "packages": [
    {
      "packagesName": "EXPANSION ENGINE",
      "investmetPackages": [
        {
          "investmentranges": [
            {
              "selectedPlanInvestmetrange": "Below 50k",
              "selectedPlanStateAndDistrict": [
                { "state": "Chandigarh" },
                { "state": "Haryana" }
              ]
            }
          ]
        }
      ]
    },
    {
      "packagesName": "SCALE ACCELERATION",
      "investmetPackages": [
        {
          "investmentranges": [
            {
              "selectedPlanInvestmetrange": "Below 50k",
              "selectedPlanStateAndDistrict": [
                { "state": "Himachal Pradesh" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Expected Behavior:**
1. Build `allPlanStatesByRange`:
   - EXPANSION ENGINE → Below 50k: [Chandigarh, Haryana]
   - SCALE ACCELERATION → Below 50k: [Himachal Pradesh]

2. When editing SCALE ACCELERATION → Below 50k:
   - Blocked states: [Chandigarh, Haryana]
   - Available states: [Himachal Pradesh, and all others]

3. When editing EXPANSION ENGINE → Below 50k:
   - Blocked states: [Himachal Pradesh]
   - Available states: [Chandigarh, Haryana, and all others]

---

## Support

If state blocking is not working:
1. Run validation function
2. Check console for error messages
3. Verify data structure matches expected format
4. Check plan ID matching
5. Look for "NOT FOUND" warnings
