const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

module.exports = async function sendEmail(email, factura, totalHtml, callback) {
    try {
        let transporter = nodemailer.createTransport(
            smtpTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASS,
                },
            })
        );
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Nueva contraseña de perfil de usuario tienda CTIAM",
            text: "Cordial saludo hemos recibido su solicitud de cambio de contraseña",
            html: `<div
            style="
                background-color: #f4f4f4;
                width: 100%;
                padding-top: 50px;
                padding-bottom: 50px;
            "
        >
            <div
                style="
                    background-color: #ffffff;
                    margin-left: auto;
                    margin-right: auto;
                    text-align: center;
                    min-width: 320px;
                    max-width: 640px;
                "
            >
                <div
                    style="
                        margin-left: auto;
                        margin-right: auto;
                        padding-bottom: 40px;
                        width: 100%;
                    "
                >
                    <div
                        style="
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color: #000000;
                        "
                    >
                        <p
                            style="
                                color: white;
                                font-size: 20px;
                                font-family: Arial, Helvetica, sans-serif;
                                padding: 0 10px;
                            "
                        >
                            OrderSoft
                        </p>
                    </div>
                    <div
                        style="
                            background-color: #9b9b9b;
                            text-align: center;
                            width: 100%;
                        "
                    >
                        <p
                            style="
                                color: white;
                                font-size: 22px;
                                font-family: Arial, Helvetica, sans-serif;
                                padding-bottom: 10px;
                                padding-top: 10px;
                                margin: 0;
                            "
                        >
                            Recibo de VENTA
                        </p>
                    </div>
                    <div
                        style="
                            font-family: Arial, Helvetica, sans-serif;
                            margin-left: auto;
                            margin-right: auto;
                            width: 85%;
                            text-align: left;
                        "
                    >
                        ${factura}
                        <div
                            style="
                                background-color: #9b9b9b;
                                text-align: center;
                                width: 100%;
                            "
                        >
                            <p
                                style="
                                    color: white;
                                    font-size: 22px;
                                    font-family: Arial, Helvetica, sans-serif;
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                "
                            >
                                Cantidad Pagada
                            </p>
                        </div>
                        ${totalHtml}
                    </div>
                    <div
                        style="
                            align-items: center;
                            display: flex;
                            justify-content: space-between;
                            margin-left: auto;
                            margin-right: auto;
                            width: 80%;
                        "
                    ></div>
                </div>
            </div>

            <div style="text-align: center; padding-top: 30px">
                <a
                    style="
                        color: #000000;
                        font-family: Arial, Helvetica, sans-serif;
                        font-weight: bold;
                        text-decoration: none;
                    "
                    href=""
                    >© OrderSoft 2021</a
                >
            </div>
        </div>`,
        });
        callback(null);
    } catch (error) {
        callback(error);
    }
};
