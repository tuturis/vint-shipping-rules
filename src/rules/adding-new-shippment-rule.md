# Adding a new shipment rule - the recipe

You will need:

- import @ShippingRule decorator
- import ShippingCostRule
- (optional) Implement and/or import repository

## Step 1

Create file with .ts extension.

## Step 2

Create the class and export it. Class name is important because it's the name of the rule.

## Step 2

The class that you created must be decorated with `@ShippingRule` and then it has to implement `ShippingCostRule`.

## Step 3

After implementing the `applyRule`, that applies rule to instance of `Shipment` class write a test that tests it.

### Step 3.1 (optional)

It's possible that you might need to use some data from repository. import or create it.

Notes:
The `shipment` class comes with values that were assigned to it before aka modified.
This should be taken into account when creating a new rule.
Tip. To see what rules where applied before the rule that you are creating - see `Shipment.appliedRules`
