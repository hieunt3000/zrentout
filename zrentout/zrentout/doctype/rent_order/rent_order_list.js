frappe.listview_settings['Rent Order'] = {
    add_fields: ["status"],
    get_indicator: function (doc) {
        const status_colors = {
            // Draft: "gray",,
            // Submitted: "yellow",
            Returned: "green",
            Completed:"gray",
            // Cancelled:"red",
            Closed:"blue",
            "On Hold": "green",
            "To Bill": "red",
            "To Payment": "red",

        };
        return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
    },
    refresh: function(listview) {
        listview.page.add_inner_button("Calculate Age", function() {
            UpdateAge(listview);
        });;
    },
};


// frappe.listview_settings['Rent Order'] = {
// 	add_fields: ["status"],
// 	get_indicator: function(doc) {
// 		return [__(doc.status), {
// 			"On Hold": "orange",
// 			// "Paid" : "green",
// 			// "Closed" : "red",
// 			// "Overdue": "red",
// 		}[doc.status], "status,=," + doc.status];
// 	}
// };
function UpdateAge(listview) {
	frappe.call({
        method: 'zrentout.zrentout.api.rentorder.cal_order_age',  
        // args: {
        //     rack_id: rackId
        // },
        // callback: function(r) {
        //     if (r.message !== undefined) {

		// 	//......code here

        //     } else {
        //         frappe.msgprint(__('Error: Unable to fetch last number.'));
        //     }
        // }
    });
     // console.log("ButtonFunction");
     // frappe.msgprint("ButtonFunction");
}
 
