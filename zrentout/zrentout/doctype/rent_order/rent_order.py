# Copyright (c) 2025, ZTEK and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RentOrder(Document):
    def validate(self):
        self.title= '/'.join(filter(None, [self.name, self.customer_name]))
        
        # frappe.msgprint("Đây là save:"+self._action)
        if self._action=="submit":
            self.status = "On Hold"
        # if self._action=="cancel":
        #     self.status = "Cancelled"

        for d in self.get("order_item"):
            avbl_qtty = frappe.db.get_value("Rent Asset", d.asset, "available_qtty")
            if (d.available_qtty != avbl_qtty):
                self.available_qtty = avbl_qtty
                #self.save()    

    # def on_update(self):
    #     if self._action=="submit":
    #         self.status = "On Hold"
            # pass
        #if self.status in ("Unpaid","Paid")

            #frappe.msgprint("doc.idx")

            # for d in self.get("order_item"):
            #     frappe.msgprint("so ID:"+str(d.idx))
        
    def on_submit(self):
        # if self._action=="submit":
        # Kiểm tra hàng có đủ trong kho không
        for d in self.get("order_item"):
            avbl_in_stock = frappe.db.get_value("Rent Asset", d.asset, "available_qtty")
            if (d.quantity > avbl_in_stock):
                self.available_qtty = avbl_in_stock
                self.save()    
                frappe.throw(f"Dòng {str(d.idx)}: Chỉ còn {str(avbl_in_stock)} {d.asset_name}, không đủ để giao!")
        # Submit thành công: Cấn trừ hàng trong kho
        for d in self.get("order_item"):
            doc = frappe.get_doc("Rent Asset", d.asset)
            doc.available_qtty -= d.quantity
            doc.order_qtty += d.quantity
            doc.save()
            doc.reload()

    def on_cancel(self):
        #msgprint("Cancel nhé!");
        for d in self.get("order_item"):
            doc = frappe.get_doc("Rent Asset", d.asset)
            doc.available_qtty += d.quantity
            doc.order_qtty -= d.quantity
            doc.save()
            doc.reload()

    def check_balance(seft):
        isOk = true
        for d in self.get("order_item"):
            avbl_qtty = frappe.db.get_value("Rent Asset", d.asset, "available_qtty")
            if (d.order_qtty != avbl_qtty):
                isOk = false
                self.available_qtty = avbl_qtty
                self.save()
                #doc.reload()
        return isOk
