export class GSTCalculator {
  static GST_RATE = 18;
  static CGST_RATE = 9;
  static SGST_RATE = 9;
  static IGST_RATE = 18;

  static calculate(baseAmount, fromState = "TN", toState = "TN") {
    const isInterState = fromState !== toState;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
      igst = (baseAmount * this.IGST_RATE) / 100;
    } else {
      cgst = (baseAmount * this.CGST_RATE) / 100;
      sgst = (baseAmount * this.SGST_RATE) / 100;
    }

    const totalGST = cgst + sgst + igst;

    const finalAmount = baseAmount + totalGST;

    return {
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      igst: parseFloat(igst.toFixed(2)),
      totalGST: parseFloat(totalGST.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2)),
      isInterState,
      gstRate: this.GST_RATE,
    };
  }
}