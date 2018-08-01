namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TituloPersonaModelo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.cat_TituloPersona",
                c => new
                {
                    TituloId = c.Int(nullable: false, identity: true),
                    Nombre = c.String(nullable: false, maxLength: 250),
                    Descripcion = c.String(maxLength: 300),
                    FechaRegistro = c.String(nullable: false),
                    Autor = c.String(nullable: false),
                    Estado = c.Boolean(nullable: false),
                })
                .PrimaryKey(t => t.TituloId);

        }
        
        public override void Down()
        {
            DropTable("CR.cat_TituloPersona");
        }
    }
}
