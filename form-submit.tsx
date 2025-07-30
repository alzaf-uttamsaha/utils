  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await createCountry(values);
      if (res.success) {
        router.refresh();
        toast.success(res.message);
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
  }
