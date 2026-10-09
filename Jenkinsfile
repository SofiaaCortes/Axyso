pipeline {
    agent any

    tools {
        nodejs 'Node_24'   // Nombre EXACTO de la instalación en Manage Jenkins > Tools
        sonarScanner 'MySonarQube' // Configurado en Global Tools
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

        // Etapa 3: Escaneo de seguridad con Snyk (después del build, antes de tests/deploy)
        stage('Security Scan with Snyk') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'SNYK_API_TOKEN', variable: 'SNYK_TOKEN')]) {
                        try {
                            // 1. Instalar Snyk CLI
                            sh 'npm install -g snyk'
                            // 2. Autenticación
                            sh 'snyk auth ${SNYK_TOKEN}'
                            // 3. Test de vulnerabilidades (fail-on si hay altas/críticas)
                            sh 'snyk test --all-projects --severity-threshold=high'
                            // 4. Monitoreo continuo (opcional)
                            sh 'snyk monitor --all-projects'
                            // 5. Generar reporte HTML (opcional)
                            sh 'snyk test --all-projects --json-file-output=snyk_results.json'
                            sh '''
                                npm install -g snyk-to-html
                                snyk-to-html -i snyk_results.json -o snyk_report.html
                            '''
                            // Publicar reporte Snyk
                            publishHTML target: [
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: '.',
                                reportFiles: 'snyk_report.html',
                                reportName: 'Snyk Security Report'
                            ]
                        } catch (err) {
                            echo "Snyk scan failed: ${err}"
                            // Marcar build como inestable si hay vulnerabilidades
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
            }
        }

        // Etapa 4: Ejecutar pruebas unitarias (Vitest) con cobertura y publicar reporte JUnit
        stage('Unit Tests') {
            steps {
                sh 'npm run test:coverage'
            }
            post {
                always {
                    junit testResults: 'test-results/*.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'test-results/*.xml,coverage/lcov.info', allowEmptyArchive: true
                }
            }
        }

        // Etapa 5: Análisis de SonarQube (después de tests para incluir cobertura)
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    sonar-scanner \
                      -Dsonar.host.url=http://localhost:9000 \
                      -Dsonar.login=${SONAR_AUTH_TOKEN} \
                      -Dsonar.javascript.node=${NODEJS_HOME}/bin/node
                    '''
                }
            }
        }
    }

    // Post-actions: Quality Gate de SonarQube y notificaciones
    post {
        always {
            script {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    error "Calidad no aprobada: ${qg.status}"
                }
            }
        }
        success {
            echo '¡Pipeline ejecutado con éxito!'
        }
        failure {
            echo 'Pipeline fallido. Revisar logs.'
        }
    }
}
