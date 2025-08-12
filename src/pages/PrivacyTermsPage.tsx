import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const PrivacyTermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-senior-xl text-primary mb-1">Termos de Privacidade</h1>
          <p className="text-muted-foreground">SeniorCare - Aplicativo da Melhor Idade</p>
        </div>
      </div>

      <div className="card-soft space-y-6 slide-up">
        <section>
          <h2 className="text-senior-lg text-primary mb-3">1. Coleta de Informações</h2>
          <p className="text-muted-foreground leading-relaxed">
            O SeniorCare coleta apenas as informações necessárias para fornecer nossos serviços, 
            incluindo nome, email, foto de perfil e preferências de atividades. Todas as informações 
            são coletadas com seu consentimento explícito.
          </p>
        </section>

        <section>
          <h2 className="text-senior-lg text-primary mb-3">2. Uso das Informações</h2>
          <p className="text-muted-foreground leading-relaxed">
            Suas informações são utilizadas exclusivamente para:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Personalizar sua experiência no aplicativo</li>
            <li>Conectá-lo com eventos e atividades relevantes</li>
            <li>Facilitar a comunicação com outros usuários</li>
            <li>Enviar notificações importantes sobre eventos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-senior-lg text-primary mb-3">3. Compartilhamento de Dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            Não compartilhamos suas informações pessoais com terceiros sem seu consentimento. 
            Os dados podem ser compartilhados apenas em situações legalmente exigidas ou para 
            proteger a segurança de nossos usuários.
          </p>
        </section>

        <section>
          <h2 className="text-senior-lg text-primary mb-3">4. Segurança dos Dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
            informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>
        </section>

        <section>
          <h2 className="text-senior-lg text-primary mb-3">5. Seus Direitos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Você tem o direito de:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados incorretos ou desatualizados</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Retirar seu consentimento a qualquer momento</li>
          </ul>
        </section>

        <section>
          <h2 className="text-senior-lg text-primary mb-3">6. Contato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para dúvidas sobre nossa política de privacidade ou para exercer seus direitos, 
            entre em contato conosco através do email: privacidade@seniorcare.com.br
          </p>
        </section>

        <section className="bg-primary-soft p-4 rounded-xl">
          <p className="text-sm text-muted-foreground">
            <strong>Última atualização:</strong> Janeiro de 2024<br/>
            Esta política pode ser atualizada periodicamente. Recomendamos que revise 
            regularmente para se manter informado sobre como protegemos suas informações.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyTermsPage;