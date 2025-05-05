import frappe
from frappe import auth
from frappe.utils import cint, get_datetime,now,today

@frappe.whitelist()
def cal_order_age():
	frappe.db.sql("""update `tabRent Order` set order_age=curdate()-expected_return_date+1 where expected_return_date<=curdate()""")
	frappe.msgprint("Done!")
