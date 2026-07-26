import { k8sApi } from "./config.js";

export async function createPods(sandboxId) {
  const podManifest = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: `sandbox-${sandboxId}`,
      },
    },
    spec: {
      containers: [
        {
          name: `sandbox-${sandboxId}`,
          image: "template:20260726-3",
          imagePullPolicy: "IfNotPresent",
          ports: [
            {
              containerPort: 5173,
              name: "http",
            },
          ],
          resources: {
            limits: {
              cpu: "500m",
              memory: "1Gi",
            },
            requests: {
              cpu: "250m",
              memory: "500Mi",
            },
          },
        },
      ],
    },
  };

  try {
    const response = await k8sApi.createNamespacedPod({
      namespace: "default",
      body: podManifest,
    });

    console.log("Pod created:", response?.metadata?.name ?? response?.body?.metadata?.name ?? "unknown");
    return response;
  } catch (error) {
    console.error("Error creating pod:", error);
    throw error;
  }
}