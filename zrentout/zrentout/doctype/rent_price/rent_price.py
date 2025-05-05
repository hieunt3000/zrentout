# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import json

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
from frappe.utils import add_days, getdate



class RentPrice(Document):
	def validate(self):
		self.set_title()

	def set_title(self):
		self.title = _("{0} / {1}").format(self.asset,self.uom)[:100]
	#pass
