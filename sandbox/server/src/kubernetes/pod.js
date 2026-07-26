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
                    image: "template:latest",
                    imagePullPolicy: "IfNotPresent",
                    ports: [
                        {
                            containerPort: 5173, // Replace with the port your application listens on
                            name: "http",
                        },
                    ],
                    resources: {
                        limits: {
                            cpu: "500m", // Adjust CPU limit as needed
                            memory: "1Gi", // Adjust memory limit as needed
                        },
                        requests: {
                            cpu: "250m", // Adjust CPU request as needed
                            memory: "500Mi", // Adjust memory request as needed
                        },
                    },
                },
            ],
        },
    };

    try {
        const response = await k8sApi.createNamespacedPod("default", podManifest);
        console.log(`Pod created: ${response.body.metadata.name}`);
    } catch (error) {
        console.error("Error creating pod:", error);
    }       
}