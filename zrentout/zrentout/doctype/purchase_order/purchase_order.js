// Copyright (c) 2025, ZTEK and contributors
// For license information, please see license.txt

frappe.ui.form.on("Purchase Order", {
		setup: function (frm) {
		frm.custom_make_buttons = {
			// "Delivery Note": "Delivery Note",
			// "Pick List": "Pick List",
			// "Sales Invoice": "Sales Invoice",
		};
	},
	refresh(frm) {
		//frm.set_query('order_item', { 'asset': '123456'});
		
	},
	grand_item: function(frm) {
			calTotalGrand(frm);
		},
	grand_service: function(frm) {
			calTotalGrand(frm);
		},
});

frappe.ui.form.on("Purchase Order Item", {
	quantity: function(frm, cdt, cdn) {
	    calTotalItem(cdt, cdn);
		},

	price: function(frm, cdt, cdn) {
	    calTotalItem(cdt, cdn);
		},
	tax: function(frm, cdt, cdn) {
	    calTotalItem(cdt, cdn);
		},
	total_amount: function(frm, cdt, cdn) {
	    calGrandTotalItem(frm);
		},
	order_item_remove: function(frm,cdt,cdn){
		calGrandTotalItem(frm);
		//calGrandTotal(frm);	
	},


});

frappe.ui.form.on("Purchase Order Service", {

	quantity: function(frm, cdt, cdn) {
	    calTotalService(cdt, cdn);
		},

	price: function(frm, cdt, cdn) {
	    calTotalService(cdt, cdn);
		},
	tax: function(frm, cdt, cdn) {
	    calTotalService(cdt, cdn);
		},
	total_amount: function(frm, cdt, cdn) {
	    calGrandTotalService(frm);	
		},
	order_service_remove: function(frm,cdt,cdn){
		calGrandTotalService(frm);		
	},


});

// Tính toán cho các dòng Item
function calTotalItem(cdt, cdn) {
    var price = frappe.model.get_value(cdt, cdn, 'price');
    
    var qtty = frappe.model.get_value(cdt, cdn, 'quantity');
    var tax = frappe.model.get_value(cdt, cdn, 'tax');
    frappe.model.set_value(cdt, cdn, 'total_amount', price *qtty* tax);
};
function calGrandTotalItem(frm) {
    var total = 0;
    $.each(frm.doc.order_item, function(i,row) {
    		total += row.total_amount;
    });

    frm.set_value({
        'grand_item': total,
    });
};
// Tính toán cho các dòng service
function calTotalService(cdt, cdn) {
    var price = frappe.model.get_value(cdt, cdn, 'price');
    
    var qtty = frappe.model.get_value(cdt, cdn, 'quantity');
    var tax = frappe.model.get_value(cdt, cdn, 'tax');
    frappe.model.set_value(cdt, cdn, 'total_amount', price *qtty* tax);
};
function calGrandTotalService(frm) {
    var total = 0;
    $.each(frm.doc.order_service, function(i,row) {
    		total += row.total_amount;
    });

    frm.set_value({
        'grand_service': total,
    });
};
////
function calTotalGrand(frm) {
	total= frm.doc.grand_service + frm.doc.grand_item;
	frm.set_value("grand_total", total);
};

