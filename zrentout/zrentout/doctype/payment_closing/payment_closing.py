# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class PaymentClosing(Document):
	# pass
	def on_submit(self):
		# Kiểm lại lần nữa các bút toán đã được thanh toán chưa, cho chắc
        # 	Phải thu
		for d in self.get("recievable_invoice"):
			# frappe.msgprint(d.rent_invoice)
			if frappe.db.exists("Rent Invoice",{"name" : d.rent_invoice,"is_paid":1}):
				frappe.throw(f"Dòng {str(d.idx)}: Phải thu {d.rent_invoice}, đã được thanh toán!")

		# 	Phải trả
		for d in self.get("payable_invoice"):
			if frappe.db.exists("Purchase Order",{ "name": d.purchase_order,"is_paid":1}):
				frappe.throw(f"Dòng {str(d.idx)}: Phải trả {d.payable_invoice}, đã được thanh toán!")

		#Không còn lỗi gì:
		# 	Xác nhận phải thu
		for d in self.get("recievable_invoice"):
			# frappe.throw("Xác nhận phải thu:"+d.rent_invoice)
			frappe.db.set_value("Rent Invoice",{"name":d.rent_invoice},{
            "is_paid":1,
            "payment_note":self.name,
            })
			
		# 	Xác nhận phải trả
		for d in self.get("payable_invoice"):
			# frappe.db.set_value("Purchase Order", d.purchace_invoice, "is_paid", 1)
			frappe.db.set_value("Purchase Order",{"name":d.purchase_order},{
            "is_paid":1,
            "payment_note":self.name,
            })

@frappe.whitelist()
def get_rent_invoice(customer,closing_date):
	datactn =frappe.db.get_list('Rent Invoice', filters={
		'customer':customer,
    	'invoice_date': ['<=', closing_date],
    	'docstatus':'1',
    	'is_paid':'FALSE',
	},fields=['name','rent_invoice','rent_name','invoice_date','total_amount'],)

	return {"datactn": datactn}

@frappe.whitelist()
def get_purchase_invoice(customer,closing_date):
	datactn =frappe.db.get_list('Purchase Order', filters={
		'provider':customer,
    	'order_date': ['<=', closing_date],
    	'docstatus':'1',
    	'is_paid':'FALSE',
	},fields=['name','purchase_name','order_date','grand_total'],)

	return {"datactn": datactn}