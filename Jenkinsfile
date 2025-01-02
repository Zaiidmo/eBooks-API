pipeline {
    agent any

    environment {
        DEPLOY_SERVER = 'ubuntu@3.124.192.157'    // Remote deployment server
        BOOKS_SERVICE_DIR = '/home/ubuntu/eBooks-API'  // Directory for the eBooks API on the server
        GIT_REPO = 'git@github.com:Zaiidmo/eBooks-API.git'  // GitHub repository URL
        DOCKER_IMAGE = 'ebooks-api'  // Docker image name
        DOCKER_TAG = 'latest'  // Docker tag for the image
        REGISTRY = 'docker.io'  // Docker registry (change if you're using a different one, e.g., AWS ECR)
        IMAGE_REPO = 'zaiidmo/ebooks-api'  // Your Docker image repository name in the registry
    }

    tools {
        nodejs 'NodeJS 20.0.0'  // Define Node.js version
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm  // Checkout the code from the GitHub repository
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'  // Install dependencies
            }
        }

        stage('Test') {
            steps {
                // Run tests
                sh 'npm test'  // Run tests if any
            }
        }

        stage('Build') {
            steps {
                // Build the application (you can define any build steps here if needed)
                sh 'npm run build'  // Run the build process
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Build Docker image
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        // stage('Push Docker Image') {
        //     steps {
        //         script {
        //             // Push Docker image to the registry
        //             docker.withRegistry('https://docker.io', 'dockerhub-credentials') {
        //                 docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()  // Replace with your credentials ID
        //             }
        //         }
        //     }
        // }

        stage('Deploy to Books-Service') {
            steps {
                sshagent(['jenkins-slave']) {
                    script {
                        sh """
                            ssh -o StrictHostKeyChecking=no $DEPLOY_SERVER "
                                cd $BOOKS_SERVICE_DIR && \
                                git pull origin master && \
                                docker-compose down && \
                                docker-compose up -d
                            "
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
