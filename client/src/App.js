import Stack from "./components/containers/Stack";
import TextInput from "./components/form/fields/TextInput";

function App() {
  return (
    <>
      <div>
        <Stack>
          <TextInput
            name="name"
            placeholder="Insira seu nome"
            labelText="Nogme de usuario"
            alertMessage="Nome de usuário inválido"
            value="jajajPPP"
          />

          <TextInput
            name="name"
            placeholder="Insira seu nome"
            labelText="Nogme de usuario"
            alertMessage="Nome de usuário inválido"
            value="jajajPPP"
            error
          />

          <TextInput
            name="name"
            placeholder="Insira seu nome"
            labelText="Nogme de usuario"
            alertMessage="Nome de usuário inválido"
            value="jajajPPP"
          />
        </Stack>
      </div>
    </>  
  );
}

export default App;