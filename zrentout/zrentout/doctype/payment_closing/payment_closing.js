// Copyright (c) 2025, ZTEK and contributors
// For license information, please see license.txt

frappe.ui.form.on("Payment Closing", {
	setup: function (frm) {
		frm.custom_make_buttons = {
			// "Delivery Note": "Delivery Note",
			// "Pick List": "Pick List",
			// "Sales Invoice": "Sales Invoice",
			// "Material Request": "Material Request",
			// "Purchase Order": "Purchase Order",
			// Project: "Project",
			// "Payment Entry": "Payment",
			// "Work Order": "Work Order",
		};

		
	},
	refresh(frm) {
		frm.set_df_property('recievable_invoice', 'cannot_add_rows', true); 
		frm.set_df_property('payable_invoice', 'cannot_add_rows', true); 

		
		let grid_recievable = frm.fields_dict["recievable_invoice"].grid.add_custom_button(__('Calculate'), function() {
            checkValidate(frm);
            
            frappe.call({
				method: "zrentout.zrentout.doctype.payment_closing.payment_closing.get_rent_invoice",
				args: {
					customer: frm.doc.customer,
					closing_date: frm.doc.closing_date,
				},
				callback: function (r) {
					//frappe.msgprint(__("Lấy phải thu!!"));

					if (r && r.message) {
						total_recievable=0;
						frm.set_value("recievable_invoice", []);
						r.message.datactn.forEach((element) => {
							

							let d = frm.add_child("recievable_invoice");
							d.rent_invoice = element.name;
							d.invoice_name = element.rent_name;
							d.invoice_date = element.invoice_date;
							d.recievable_amt = element.total_amount;
							total_recievable += element.total_amount;
						});
						frm.refresh_field("recievable_invoice");
						frm.set_value({
					        'total_recievable': total_recievable,
					    });

					}
				},
			});
        });
    	grid_recievable.addClass('order-1');
    	// Lấy dữ liệu phải trả
    	let grid_payable = frm.fields_dict["payable_invoice"].grid.add_custom_button(__('Calculate'), function() {
            checkValidate(frm);
            frappe.call({
				method: "zrentout.zrentout.doctype.payment_closing.payment_closing.get_purchase_invoice",
				args: {
					customer: frm.doc.customer,
					closing_date: frm.doc.closing_date,
				},
				callback: function (r) {
					//frappe.msgprint(__("Lấy phải trả!!"));
					
					if (r && r.message) {
						total_payable=0;
						frm.set_value("payable_invoice", []);
						r.message.datactn.forEach((element) => {
							

							let d = frm.add_child("payable_invoice");
							d.purchase_order = element.name;
							d.invoice_name = element.purchase_name;
							d.invoice_date = element.order_date;
							d.payable_amt = element.grand_total;
							total_payable += element.grand_total;
						});
						frm.refresh_field("payable_invoice");
						frm.set_value({
					        'total_payable': total_payable,
					    });

					}
				},
			});
        });
    	grid_payable.addClass('order-1');
	},
	total_recievable: function(frm) {
			calTotalBalance(frm);
		},
	total_payable: function(frm) {
			calTotalBalance(frm);
		},
	before_save: function(frm) { 
		// frappe.throw("Trước khi ghi!");
		// if (frm.doc.customer)
		//     frappe.throw("PO Number missing");
		// else
		//     frappe.msgprint("Value updated");
		},	
});

function checkValidate(frm) {
	if (!frm.doc.customer ) {
				
				frappe.ui.scroll("[data-fieldname='customer']");
				frappe.throw(("Mời nhập khách hàng!"));
				//frappe.msgprint(__("Enter a valid Date of Birth"));
				//frappe.validated = false;
			}
	if (!frm.doc.closing_date ) {
				frappe.throw(("Chưa nhập ngày!"));
			}
}
function calTotalBalance(frm) {
	total= frm.doc.total_recievable - frm.doc.total_payable;
	frm.set_value("total_balance", total);
};

frappe.ui.form.on("Payment Closing Recievable", {

	recievable_invoice_remove: function(frm,cdt,cdn){
		var total = 0;
	    $.each(frm.doc.recievable_invoice, function(i,row) {
	    		total += row.recievable_amt;
	    });

	    frm.set_value({
	        'total_recievable': total,
	    });		
	},


});

frappe.ui.form.on("Payment Closing Payable", {

	payable_invoice_remove: function(frm,cdt,cdn){
		var total = 0;
	    $.each(frm.doc.payable_invoice, function(i,row) {
	    		total += row.payable_amt;
	    });

	    frm.set_value({
	        'total_payable': total,
	    });		
	},


});
