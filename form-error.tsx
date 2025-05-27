  async function onSubmit(values: FormData) {
    console.log("Form submitted:", values);
    try {
      const res = await returnSale(values);

      if (res.success) {
        toast.success(res?.message);
      } else {
        if (typeof res?.error === "string") {
          throw new Error(res?.error);
        } else {
          Object.entries(res?.error as any).map(([key, value]: any) => {
            form.setError(key as any, { message: value[0] });
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }

    // Handle form submission here
  }
