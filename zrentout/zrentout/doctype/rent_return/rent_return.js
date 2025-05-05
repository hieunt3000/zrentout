// Copyright (c) 2025, ZTEK and contributors
// For license information, please see license.txt

frappe.ui.form.on("Rent Return", {
	refresh(frm) {
		frm.set_query('rent_order', { 'status': 'On Hold','docstatus':'1'});
	},
	rent_order: function(frm) {
		//frm.message("Daay nhe");
		
        if (frm.doc.rent_order) {

            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Rent Order',
                    filters: {
                        name: frm.doc.rent_order
                    }
                },
                callback: function(r) {

                    if (r.message) {
                        // Clear existing custom color details table rows
                        frm.clear_table('rent_item');

                        // Iterate through the fetched data from custom_color_details and populate the table
                        r.message.order_item.forEach(function(item) {
                        	//frappe.msgprint(item.asset);
                            let child = frm.add_child('rent_item');
                            child.asset = item.asset;
                            child.asset_name = item.asset_name;
                            child.order_qtty = item.quantity;
                            child.return_qtty = item.quantity;
                            // child.panton_code = item.panton_code;
                            // child.cylinder_no = item.cylinder_no;
                            // Add other child table fields as needed
                        });
                        
                        // Refresh the child table to show updated data
                        frm.refresh_field('rent_item');
                    }
                }
            });
        } else {
            // Clear the custom color details if no sales order is selected
            frm.clear_table('rent_item');
            frm.refresh_field('rent_item');
        }
    }

});
