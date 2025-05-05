// Copyright (c) 2025, ZTEK and contributors
// For license information, please see license.txt
//cur_frm.cscript.tax_table = "Sales Taxes and Charges";

frappe.ui.form.on("Rent Order", {
	setup: function (frm) {
		frm.custom_make_buttons = {
			// "Delivery Note": "Delivery Note",
			// "Pick List": "Pick List",
			// "Sales Invoice": "Sales Invoice",
		};
	},
	refresh(frm) {
		//frm.set_query('order_item', { 'asset': '123456'});
		

		let grid_button = frm.fields_dict["order_item"].grid.add_custom_button(__('Re Calculate'), function() {
            frappe.msgprint(__("Done!!"));
        });
    	grid_button.addClass('order-1');

    	// if (frm.doc.docstatus == 1) {
	    // 	frm.add_custom_button(__('Payment'), 
	    // 		function () {
		// 			frappe.db.insert({
		// 				'doctype': 'Payment Entry',
		// 				'payment_type': "Receive",
		// 				'party_type': "Customer",
		// 				'party': frm.doc.customer,
		// 				//'paid_amount': frm.doc.rounded_total,
		// 				//'received_amount': frm.doc.rounded_total,
		// 				'paid_amount': 110000,
		// 				'received_amount': 11000,
		// 				//'source_exchange_rate': frm.doc.conversion_rate,
		// 				//'target_exchange_rate': frm.doc.conversion_rate,
		// 				'docstatus':1,
		// 				'references': [{
		// 					'reference_doctype': frm.doc.doctype,
		// 					'reference_name' : frm.doc.name
		// 				}]
		// 			}).then(doc => {
		// 				frappe.show_alert("Payment Entry is created successfully")
		// 			});
		// 		},
	    // 		,__('Create'));
    	// }

    	
	},
	grand_total_item: function(frm) {
		calGrandTotal(frm);
	},
	grand_total_service: function(frm) {
		calGrandTotal(frm);
	},
	tax_name: function(frm) {
		calGrandAfterTax(frm);
	},

	onload: function (frm) {
		frm.fields_dict['order_item'].grid.get_field('price_list').get_query =
	      function (doc, cdt, cdn) {
	        var row = locals[cdt][cdn]
	        return {
	          filters: { asset: row.asset },
	        }
	      }
	},
	expected_out_date: function(frm) {
		calReturnDate(frm);
	},
	discount_pecentage: function(frm) {
		calDiscount(frm);
	},
	order_template: function (frm) {
		var total_day = frm.doc.expected_total_day;
		if (frm.doc.order_template) {
			frappe.call({
				method: "zrentout.zrentout.doctype.rent_order_temp.rent_order_temp.get_all_item",
				args: {
					template_name: frm.doc.order_template,
					doc: frm.doc,
				},
				callback: function (r) {
					if (r && r.message) {
						frm.set_value("order_item", []);
						r.message.order_template.order_item.forEach((element) => {
								let d = frm.add_child("order_item");
								d.asset = element.asset;
								d.asset_name = element.asset_name;
								d.price_list = element.price_list;
								d.rate = element.rate;
								d.rent_total = total_day;

								d.quantity = element.quantity;
								d.amount = d.rate*d.quantity*total_day;
							});
						frm.refresh_field("order_item");

						frm.set_value("service_item", []);
						r.message.order_template.service_item.forEach((element) => {
								//frappe.msgprint("Add service");

								let d = frm.add_child("service_item");
								d.service = element.service;
								d.service_name = element.service_name;
								d.rate = element.rate;
								d.total_day = total_day;

								d.quantity = element.quantity;
								d.amount = d.rate*d.quantity*total_day;
							});
						frm.refresh_field("service_item");

					}
				},
			});
		}
	},
	validate: function(frm) {
		//frm.doc.description="Test";
		//runCalculation(frm, frm.doc);
		//frappe.msgprint("Validate nhé!");
	}
	
    
});


function calReturnDate(frm) {
	frm.set_value("expected_return_date", frappe.datetime.add_days(frm.doc.expected_out_date, frm.doc.expected_total_day));
};

// Tính toán cho Order Item 
function runCalAmount(cdt, cdn) {
    var total = frappe.model.get_value(cdt, cdn, 'rent_total');
    var rate = frappe.model.get_value(cdt, cdn, 'rate');
    var qtty = frappe.model.get_value(cdt, cdn, 'quantity');
    frappe.model.set_value(cdt, cdn, 'amount', rate *qtty* total);
};

function runCalGrandItem(frm, doc) {
    var total_item_val = 0;
    $.each(doc.order_item, function(i,row) {
    		total_item_val += row.amount;
    });

    frm.set_value({
        'grand_total_item': total_item_val,
    });
};
// Tính toán cho Service
function runCalService(cdt, cdn) {
    var total = frappe.model.get_value(cdt, cdn, 'total_day');
    var rate = frappe.model.get_value(cdt, cdn, 'rate');
    var qtty = frappe.model.get_value(cdt, cdn, 'quantity');
    frappe.model.set_value(cdt, cdn, 'amount', rate *qtty* total);
};

function runCalGrandService(frm, doc) {
    var total_val = 0;
    $.each(doc.service_item, function(i,row) {
    		total_val += row.amount;
    });

    frm.set_value({
        'grand_total_service': total_val,
    });
};
///////////////////////
function calGrandTotal(frm) {
	var grand_total_item = frm.doc.grand_total_item;
	var grand_total_service = frm.doc.grand_total_service;
	var discount_amount = frm.doc.discount_amount;
    var grand_total = grand_total_item+grand_total_service
	frm.set_value("grand_total",grand_total);
	frm.set_value("grand_total_after_discount",grand_total-discount_amount);
	calGrandAfterTax(frm);
};

function calDiscount(frm) {
	var grand_total = frm.doc.grand_total;
	var discount_pecentage = frm.doc.discount_pecentage;
	var discount_amount=discount_pecentage*grand_total*0.01;
	frm.set_value("discount_amount",discount_amount);
	calGrandTotal(frm);

};
function calGrandAfterTax(frm) {
	var tax_rate = frm.doc.tax_rate;
	var grand_total_after_discount = frm.doc.grand_total_after_discount;
	
    var tax_amount = grand_total_after_discount*tax_rate*0.01
	frm.set_value("tax_amount",tax_amount);
	frm.set_value("grand_total_after_tax",grand_total_after_discount+tax_amount);
	
};
// Tính toán lại toàn bộ
function reCalAll() {
	for (let row of frm.doc.order_item) {

	}

}

///Trigger cho Rent Order
frappe.ui.form.on("Rent Order Item", {
	rate: function(frm, cdt, cdn) {
    
	    runCalAmount(cdt, cdn);
	    runCalGrandItem(frm,frm.doc);
	    //calGrandTotal(frm);		
		},
	quantity: function(frm, cdt, cdn) {
		runCalAmount(cdt, cdn);
	    runCalGrandItem(frm,frm.doc);
	    //calGrandTotal(frm);	
	},
	order_item_add: function(frm,cdt,cdn){
		var total_date = frm.doc.expected_total_day;
		frappe.model.set_value(cdt, cdn, 'rent_total', total_date);
	},
	order_item_remove: function(frm,cdt,cdn){
		runCalGrandItem(frm,frm.doc);
		//calGrandTotal(frm);	
	},


});

// Trigger cho Service
frappe.ui.form.on("Rent Order Service", {
	rate: function(frm, cdt, cdn) {
	    runCalService(cdt, cdn);
	    runCalGrandService(frm,frm.doc);
	    //calGrandTotal(frm);	
		},
	quantity: function(frm, cdt, cdn) {
		runCalService(cdt, cdn);
	    runCalGrandService(frm,frm.doc);
	    //calGrandTotal(frm);	
	},
	service_item_add: function(frm,cdt,cdn){
		var total_day = frm.doc.expected_total_day;
		frappe.model.set_value(cdt, cdn, 'total_day', total_day);
	},
	service_item_remove: function(frm,cdt,cdn){
		runCalGrandService(frm,frm.doc);
		//calGrandTotal(frm);	
	},


});

