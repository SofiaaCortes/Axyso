pipeline {
    agent any

    tools {
        nodejs 'Node_24'   // Nombre EXACTO de la instalación en Manage Jenkins > Tools
    }

    environment {
        CI = 'true'
        NEXT_TELEMETRY_DISABLED = '1'
    }

    stages {
        // Etapa 1: Checkout del código desde GitHub
        stage('Checkout') {
            steps {
                // IMPORTANTE: reemplaza la URL por la de TU repositorio de GitHub
                git branch: 'main', url: 'https://github.com/SofiaaCortes/Axyso.git'
            }
        }

        // Etapa 2: Instalar dependencias y build del proyecto (Next.js)
        stage('Build') {
            steps {
                sh 'node -v && npm -v'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        // Etapa 3: Ejecutar pruebas unitarias (Vitest) y publicar reporte JUnit
        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit testResults: 'test-results/*.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'test-results/*.xml', allowEmptyArchive: true
                }
            }
        }
    }

    // Post-actions: notificaciones de éxito / fallo
    post {
        success {
            echo '¡Pipeline ejecutado con éxito!'
        }
        failure {
            echo 'Pipeline fallido. Revisar logs.'
        }
    }
}
