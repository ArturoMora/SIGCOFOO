namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class autoresEstudioMercado : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_AutoresEstudioMercado",
                c => new
                    {
                        AutoresEstudioMercadoId = c.Int(nullable: false, identity: true),
                        EstudiosMercadoId = c.Int(nullable: false),
                        ClavePersona = c.String(),
                        NombrePersona = c.String(),
                    })
                .PrimaryKey(t => t.AutoresEstudioMercadoId);
            
        }
        
        public override void Down()
        {
            DropTable("CR.tab_AutoresEstudioMercado");
        }
    }
}
