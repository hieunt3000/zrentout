# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RentReturn(Document):
	#pass
	def on_update(self):
		# if self._action=="save":
		# 	frappe.msgprint("update nhe")

		if self._action=="submit":
			# Cập nhật trạng thái
			frappe.db.set_value("Rent Order", self.rent_order, {
				#'workflow_state' : 'Closed',
				'status': 'To Bill'
				})
			
			for d in self.get("rent_item"):
				doc = frappe.get_doc("Rent Asset", d.asset)
				doc.available_qtty += d.return_qtty
				doc.order_qtty -= d.return_qtty
				doc.save()
			#for d in self.get("rent_item"):
			# Trả hàng lại kho
			#for d in self.get("rent_item"):
            #doc = frappe.get_doc("Rent Asset", d.asset)
            	#doc.available_qtty += d.return_qtty
            	#doc.order_qtty -= d.return_qtty
            	#doc.save()