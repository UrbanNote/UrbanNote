import { useRef } from 'react';

import { Button, Col, Form } from 'react-bootstrap';

import { signOut } from '$firebase/auth';
import { createUserProfile } from '$firebase/users';

import './Onboarding.scss';

interface Props {
  userEmail: string | undefined;
}

export default function Onboarding({ userEmail }: Props) {
  // const emailInputRef = useRef<HTMLInputElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const chosenNameInputRef = useRef<HTMLInputElement>(null);
  const languageSelectRef = useRef<HTMLSelectElement>(null);

  const handleCreateProfile = async () => {
    await createUserProfile({
      firstName: firstNameInputRef.current!.value,
      lastName: lastNameInputRef.current!.value,
      chosenName: chosenNameInputRef.current?.value,
      email: userEmail!,
      language: languageSelectRef.current!.value,
    });
  };

  const handleSubmit = () => {
    handleCreateProfile();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="viande">
      <h1>Bienvenue à UrbanNote !</h1>
      <p>Il nous manque quelques informations pour compléter votre profil.</p>
      <br></br>
      <p>
        Les champs obligatoires sont marqués d&apos;une astérisque (<span className="asterisk">*</span>).
      </p>
      <h2 className="subtitle">Mon profil</h2>
      <Form>
        <Form.Group className="mb-3" controlId="OnboardingForm.firstName">
          <Form.Label>Prénom</Form.Label>
          <Form.Label className="asterisk">*</Form.Label>
          <Form.Control type="firstName" placeholder="Entrez votre prénom" ref={firstNameInputRef} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="OnboardingForm.lastName">
          <Form.Label>Nom de famille</Form.Label>
          <Form.Label className="asterisk">*</Form.Label>
          <Form.Control type="lastName" placeholder="Entrez votre nom de famille" ref={lastNameInputRef} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="OnboardingForm.chosenName">
          <Form.Label>Prénom choisi</Form.Label>
          <Form.Control type="chosenName" placeholder="You were the chosen One!" ref={chosenNameInputRef} />
          <Form.Text>
            Si vous voulez qu&apos;un prénom différent apparaise dans l&apos;application et dans les communications,
            entrez-le ici.
          </Form.Text>
        </Form.Group>

        <h2 className="subtitle">Informations de contact</h2>

        <Form.Group as={Col} className="mb-3" controlId="OnboardingForm.language">
          <Form.Label>Langue</Form.Label>
          <Form.Select defaultValue="Français canadien" ref={languageSelectRef}>
            <option>Français canadien</option>
            <option>English</option>
          </Form.Select>
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="OnboardingForm.email">
          <Form.Label>Adresse courriel</Form.Label>
          <Form.Control type="email" ref={emailInputRef} value={userEmail} onChange={handleChangeEmail} />
        </Form.Group> */}
        <div className="footer-button">
          <Button type="submit" variant="success" onClick={handleSubmit}>
            Sauvegarder
          </Button>
          <Button variant="danger" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </Form>
    </div>
  );
}
