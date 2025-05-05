# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class StockEntry(Document):
	#pass

	def on_update(self):
		# if self._action=="save":
		# 	frappe.msgprint("update nhe")
		# elif self._action=="submit":
		# 	frappe.msgprint("submit nhe")
		if self._action=="submit":
			doc = frappe.get_doc("Rent Asset", self.asset)
			if self.trans_type=="In":
				doc.stock_qtty += self.qtty
				doc.available_qtty += self.qtty
			else:
				doc.stock_qtty -= self.qtty
				doc.available_qtty -= self.qtty
			doc.save()

	# def on_update_after_submit(self):
	# 	frappe.throw("before_update_after_submit")
	# doc = frappe.get_doc("Asset Rent", self.asset)
	# doc.stock_qtty += self.stock_qtty
	# doc.save()
	

		#self.check_voucher_consumption()

		