# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document
from frappe.utils.jinja import validate_template


class RentOrderTemp(Document):
	pass

@frappe.whitelist()
def get_all_item(template_name, doc):
	if isinstance(doc, str):
		doc = json.loads(doc)

	order_template = frappe.get_doc("Rent Order Temp", template_name)

	return {"order_template": order_template}
	