import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {

    userVerificationTemplate(name: string, token: string, email: string) {
        return `<div>
            <h3>Bonjour ${name}, </h3>
            <br />
            <p>Vous vous êtes inscrit à la page carrière de BOND'AF comme ${email}.
                Après avoir validé votre adresse e-mail, votre demande sera examinée. </p>
            <br />


            <p>
                Veuillez cliquer sur le lien ci-dessous pour valider votre adresse e-mail,
                si le lien ne fonctionne pas, veuillez copier et coller l'URL dans un navigateur.
            </p>
            <br />

            <a href=${`${process.env.BONDAF_APP_URL}/verification?authtoken=` + token} target="_blank">Click Here</a>


            <p>Cordialement</p>
        </div>`
    }
}
