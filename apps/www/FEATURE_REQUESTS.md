# ...
# SAT, MAR 22
- login profile cache
- email render
- midday table & filter
- migrate db
- midday animation on component section
- shelf item inventory mgmt
  - add/edit category
  - add/edit product
  - product inventory mgmt
  - get product counts for each category
- customer dashboard
  - wallet balance
  - total due | total overdraft
  - orders, quotes
  - generate report
  - mark orders and send notification
  - payment notification
# FRI, MAR 21
- shelf items
  - add new category (category manager)
# THUR, MAR 20
- .
- activity backdoor
- new feature customer not showing address.
- sales form: swap door height
- sales commission page
  - create-sales-commission-action
    - check if sales has no existing comission
    - get commission percentage from table
    - ask if commission should be created after sales is completed
  - comission status: pending, paid
    - create sales comission payment table
  - show attached sale order no and status
  - sort by: sales rep, date.
  - mark and pay
- sales restore state
  - when restore point is selected:
    - if there is conflict between items: production,delivery,item-removal
    - show resolution modal to give restore options:
      - clear production & delivery
      - keep production & delivery (show which production will be deleted due to item not available in restore)
      - 
# TUE, MAR 18
- sales subscription: select target users and events
- sales notification
  - sales created
  - sales edited
  - payment applied
- sales payment check: make check required
- copy as: show button to open
<!-- - door price not coming out right. -->
# MON, MAR 17
- system backdoor to see all activities going on
  - email notification
  - subscription page to subscribe for activities to be notified for
  - email footer to unsubscribe for a particular notification

- new feature: add shipping line (shipping: same as billing [change])
- create dispatch, create batch assignment

# SAT, MAR 15
    - new sales form info page
    - stack it all back to a single page
    - 
    - fix auto scroll
    - remove footer summary and fix it to the right for big screen
    - inventory page tabs: shelf items, components
      - doors variants mgmt and stocks
    - feature: make component shelf item
      - make it connect to component pricing system
      - one component can have multiple shelf items (variants)
      - when create shelf is clicked: show step forms and select applicable step which will serve as category and add variant title (which will be prefixed to component name)
      - when create shelf is clicked: check component if it has variant and automatically map to all variants prices (A BIT COMPLEX: if not able to accomplish then restrict to one price component)
# MON, MAR 11
    - customer report sheet, balance owed, wallet balance, sales, quotes
    - door inventory management
      - size management as variants
      - inbound qty
      - low qty alert settings
      - track qty based on invoices
      - 
    - payment page error states
    - 
<!-- - customer profile changing not working. -->
<!-- - exterior doors selection -->
# MON, MAR 10
  - Make roles and meta data cached from server action and not hard stored with login.
  - sales filter
    - net terms: ...terms, has term, no term
    - profiles: ...profiles, has profile, no profile
  - swap door: add search
  - invoice success: notify sales rep
  - make invoice payment optional.
  - inventory management system
    - shelf inventory dashboard and overview sheet assessible form new dashboard, orders,quick action.
    - manage shelf categories and products, set available qty
    - manage components as inventorie
# SAT, MAR 09
- check sales email & phoneNo before sending email.
- add continue anyway if phoneNo is not there: put note ( customer will be prompted before checkout)
- sales checkout if no phone no, prompt customer.
# SAT, MAR 08
# FRI, MAR 07
- global side-nav
- dispatch page.
- invoice paid water-mark
- move to sales: open button to edit.
- multiple invoices on a single email.
- search filter not forgetting marked items when filter changes.
- marked items x btn not working.
- accounting delete payment: reflect on orders.
- sales delete order reflect on accounting.
- sales extra costs.
# WED, MAR 05
- route cache
# TUE, MAR 04
- payment method: payment link
- add payment link generation to email.
- transform modals to querystate
  - customer modal with on back handle
  - customer payment modal
  - sales overview modal
- components sorting
- clean invoice safe (prevent duplicates)
- add notification when email is sent.
# MON, MAR 03
  - sales page mobile responsive  
  - sales overview footer in mobile view
  - customer wallet for refund. 
  - shelf items.
  - transaction payment method.
  - shipping not selecting all available.
  - split batch assignment & shipping to task chunks.
  - service production toggle not working.
# THUR, MAR 01
- midday print feature.
# WED, FEB 28
- Payment Transactions Page: delete, recheck sync
- customer wallet profile.
# WED, FEB 27
- add midday animation to invoice builder
- batch production: throw error when already assigned item is selected
- create feature-request feature
- email system:
    - create and send email.
    - invoice updated email.
    - reminder email.
    - quote email.
- invoice copy & move history
- payment portal: created, saved but not applied.
<!-- - change door size in print to inch. -->
<!-- - add delivery charge to invoice. -->
<!-- - zero custom price -->
# WED, FEB 26 
- delete payment
- new sales dashboard
  - 
- invoice page footer: show amount paid in footer.
- emails: create and send, send reminder etc.
- remember customer tier when changed
- sales filters:
  - production assignment
  - dispatch status ``
<!-- - change alert position -->
<!-- - sales print: remove footer on every page -->
  <!-- - invoice filter -->

# #################################################
- PRODUCTION VIEW SECTIONED JUST LIKE IN PRINT
- WHEN NEW SIZE IS ADDED AFTER SAVE, IT REQUIRES DOUBLE SAVE
- Multi-Height Select
- DELETE SUBMISSION ACTION
- TAKE PICTURE OF ORDER BEING LOADED.
- DELIVERY/DISPATCH
    AUTO MARK AS DELIVERED.
    AUTO ASSIGN ALL.
-  BUG: WHEN MENU IS OPENED IN MODAL AND MODAL IS CLOSED, NOTHING CLICKS
-  CUSTOM COMPONENT
<!-- - AUTO REFRESH ON PAYMENT -->
<!-- - INVOICE PRINT AND OVERVIEW FROM EDIT PAGE -->
# #################################################