# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RentInvoice(Document):
	# def on_submit(self):
	# 	doc = frappe.get_doc("Rent Order", self.rent_order)
        #doc.accumulate_amount += self.pay_amount
        # #if(doc.accumulate_amount == doc.grand_total_after_tax):
        #doc.workflow_state = "Paid"
		#doc.status = "Paid"
        # doc.save()
        # doc.reload()
	def on_submit(self):
		doc = frappe.get_doc("Rent Order", self.rent_order)
		doc.accumulate_amount += self.pay_amount
		# doc.workflow_state = "Paid"
		doc.status = "To Payment"
		doc.save()
		doc.reload()
        #doc.available_qtty -= d.quantity
        #    doc.order_qtty += d.quantity


	