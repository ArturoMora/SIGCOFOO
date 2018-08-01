namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevaTablaEspecialista : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Especialista",
                c => new
                    {
                        EspecialistaId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(maxLength: 250),
                        ApellidoPaterno = c.String(maxLength: 250),
                        ApellidoMaterno = c.String(maxLength: 250),
                        Telefono = c.String(maxLength: 20),
                        Extension = c.String(maxLength: 10),
                        Celular = c.String(maxLength: 30),
                        Correo = c.String(maxLength: 100),
                        Autor = c.String(nullable: false, maxLength: 250),
                        FechaRegistro = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.EspecialistaId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Especialista");
        }
    }
}
