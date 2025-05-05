# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RentAsset(Document):
	pass
	# def on_update(self):
		# if self.stock_qtty:
		# 	self.available_qtty=self.stock_qtty - self.order_qtty - self.rent_qtty
		# 	self.save()