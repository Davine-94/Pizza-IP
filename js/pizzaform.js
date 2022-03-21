$(document).ready(function () {
    function orderPizza(size, ourCrustType, toppings, quantity, yourDelivery) {
        this.size = size;
        this.ourCrustType = ourCrustType;
        this.toppings = toppings;
        this.quantity = quantity;
        this.yourDelivery = yourDelivery;
    }

    orderPizza.prototype.deliveryPrice = 150;

    orderPizza.prototype.orderTotal = 0;

    orderPizza.prototype.pizzaSizePrices = [
        { size: "small", price: 800 },
        { size: "medium", price: 1100 },
        { size: "large", price: 1500 },
    ];

    orderPizza.prototype.toppingsPrices = [
        { name: "mushrooms", price: 100 },
        { name: "onions", price: 80 },
        { name: "sausage", price: 100},
        { name: "extraCheese", price: 100 },
        
    ];

    orderPizza.prototype.getTotal = function () {
        let total = 0;

        if (this.size) {
            const pizzaSize = this.size;

            const size = orderPizza.prototype.pizzaSizePrices.find(function (p) {
                return p.size === pizzaSize;
            });

            total = total + size.price;
        }

        if (this.toppings) {
            let toppingsTotal = 0;
            const pizzaToppings = this.toppings;

            for (let i = 0; i < pizzaToppings.length; i++) {
                const topping = orderPizza.prototype.toppingsPrices.find(function (p) {
                    return p.name === pizzaToppings[i].trim();
                });

                toppingsTotal = toppingsTotal + topping.price;
            }

            total = total + toppingsTotal;
        }

        total = total * this.quantity;

        if (this.yourDelivery === "yes") {
            total = total + orderPizza.prototype.deliveryPrice;
        } else {
            total = total + 0;
        }

        orderPizza.prototype.orderTotal = total;

        return total;
    }

    // Get pizza name from url
    const urlParams = new URLSearchParams(window.location.search);
    const pizzaName = urlParams.get("pizza");

    // Add pizza name to html
    $("#pName").html(pizzaName);
    $("#sName").html(pizzaName);

    // Hide delivery address input
    $("#yesToDelivery").hide();

    // Get input references
    let pizzaSize = "";
    let ourCrustType = "";
    let delivery = "";
    let quantity = 1;
    let toppings = [];

    function completeAmount() {
        const newPizza = new orderPizza(pizzaSize, ourCrustType, toppings, quantity, delivery);
        const newTotal = newPizza.getTotal();

        $("#sTotal").html(`Total - Ksh. ${newTotal}`);
    }

  
    $("input[name=pizzaSizes]").change(function () {
        pizzaSize = $('input[name=pizzaSizes]:checked').val();

        $("#sSize").html(`Size - ${pizzaSize}`);

     
     completeAmount();
    });

    
    $("input[name=ourCrustType]").change(function () {
        ourCrustType = $('input[name=ourCrustType]:checked').val();

        $("#sCrust").html(`Crust - ${ourCrustType}`);

       
     completeAmount();
    });

  
    $("input[name=toppings]").change(function () {
        const newToppings = [];

        $.each($("input[name='toppings']:checked"), function () {
            
            newToppings.push(` ${$(this).val()}`);
        });

        toppings = newToppings;

        $("#sToppings").html(`Toppings - ${toppings}`);

     completeAmount();
    });

   
    $("input[name=delivery]").change(function () {
        delivery = $('input[name=delivery]:checked').val();

        if (delivery === "no") {
            $("#yesToDelivery").hide();
            $("#sdelivery").html(`Delivery fee - Ksh. 0`);

          
         completeAmount();
        } else if (delivery === "yes") {
            $("#yesToDelivery").show();
            $("#sDelivery").html(`Delivery fee - Ksh. ${orderPizza.prototype.deliveryPrice}`);

            // Get new total
         completeAmount();
        }
    });

    $("#quantity").change(function () {
        const newQuantity = $('#quantity').val();

        if (newQuantity < 1) {
            quantity = 1;
            $('#quantity').val(1);
        } else {
            quantity = newQuantity;
        }

      
     completeAmount();
    });

    function showError(message) {
        $(".errorArea").fadeIn();

        $(".errorArea").html(`
      <div class="alert alert-danger" role="alert">
        ${message}
      </div>
    `);

        setTimeout(function () {
            $(".errorArea").fadeOut();
        }, 5000);
    }


    function placeOrder() {
        if (!pizzaSize) {
            return showError("You must select a pizza size");
        }

        if (!ourCrustType) {
            return showError("You must select a crust type");
        }

        if (!delivery) {
            return showError("You must select a delivery option");
        }

        const newToppings = [];

        $.each($("input[name='toppings']:checked"), function () {
            newToppings.push($(this).val());
        });

        toppings = newToppings;

        // Get new total
     completeAmount();

       
        const deliveryAddress = $("#dAddress").val();

        $("#oSummaryName").html(pizzaName);
        $("#oSummarySize").html(`<b>Size</b> <br/> ${pizzaSize}`);
        $("#oSummaryCrust").html(`<b>Crust Type</b> <br/> ${ourCrustType}`);
        $("#oSummaryToppings").html(`<b>Toppings</b> <br/> ${toppings}`);
        $("#oSummaryQuantity").html(`<b>Quantity</b> <br/> ${quantity}`);
        $("#oSummaryTotal").html(`<b>Total</b> <br/> Ksh. ${orderPizza.prototype.orderTotal}`);

        if (delivery === "yes") {
            $("#oSummaryDeliveryFee").html(`<b>Delivery Fee</b> <br/> Ksh. ${orderPizza.prototype.deliveryPrice}`);
        } else {
            $("#oSummaryDeliveryFee").html(`<b>Delivery Fee</b> <br/> Ksh. 0`);
        }

        $("#oSummarydeliveryAddress").html(`<b>Delivery Address</b> <br/> ${deliveryAddress}`);

        // Show order modal
        $('#orderModal').modal('show');

        // clear fields
         document.querySelector('input[type="radio"]:checked').checked = false;
       
    
    }

    $("#order-btn").click(function () {
        placeOrder();
       
        
    });

  
});