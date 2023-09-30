
type Hyper = {
    n_epochs: number;
  };
  type ErrorMessage = {
    message: string | undefined;
  };
  

export type JobResponseObject = {
    error?: ErrorMessage | null;
    id?: string;
    status?: string;
    organization_id?: string;
    model?: string;
    fine_tuned_model?: string;
    hyperparameters?: Hyper | null;
  };
  
export async function sendTextAsFile(textContent: string, key: string): Promise<JobResponseObject> {
    const url = 'https://api.openai.com/v1/files';
    const headers = {
      Authorization: `Bearer ${key}`,
    };
  
    const formData = new FormData();
    formData.append('purpose', 'fine-tune');
    formData.append('file', new Blob([textContent], { type: 'text/plain' }));
    //fs.writeFileSync('plik5.txt', textContent);
    //const fileData = fs.readFileSync('plik2.txt');
    //formData.append('file', new Blob([fileData]), 'plik2.txt');
  
    const options = {
      method: 'POST',
      headers: headers,
      body: formData,
    };
  
    try {
      const response = await fetch(url, options);
      return (await response.json()) as JobResponseObject;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
  