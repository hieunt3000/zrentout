// Copyright (c) 2025, ZTEK and contributors
// For license information, please see license.txt

frappe.ui.form.on("Rent Invoice", {
	refresh(frm) {
		frm.set_query('rent_order', { 'status': 'To Bill','docstatus': '1'});

	},
	total_amount: function(frm) {
		var total_amt = frm.doc.total_amount;
		var paid_amt = frm.doc.paid_amount;
		frm.set_value("pay_amount", total_amt>paid_amt?total_amt-paid_amt:0);
	},
});
