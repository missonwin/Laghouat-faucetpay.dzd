const RewardHandler = {
    submitClaimFormWith: function(cryptoType) {
        //console.log("📤 Valor de cryptoType RewardHandler:", cryptoType);
        if (!cryptoType) {
            //console.warn("⚠️ cryptoType está vacío");
            MyApp.Utils.showAlert("No se encontró la moneda seleccionada.", "error", "alertContainer");
            return;
        }

        MyApp.Utils.post("faucet-config/index.php", {
            cryptoType
        }).then(result => {
            if (result && result.success) {
                MyApp.Utils.showAlert(result.message || "Transacción exitosa.", "success", "alertContainer");
            } else {
                MyApp.Utils.showAlert(result.message || "Error al procesar transacción.", "info", "alertContainer");
            }
        }).catch(error => {
            console.error("❌ Error al enviar el formulario:", error);
            MyApp.Utils.showAlert("Hubo un problema al procesar tu solicitud.", "error", "alertContainer");
        });
    },
};