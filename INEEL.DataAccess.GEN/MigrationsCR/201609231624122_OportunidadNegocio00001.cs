namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OportunidadNegocio00001 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_Eventos",
                c => new
                    {
                        EventoId = c.Int(nullable: false, identity: true),
                        NombreEvento = c.String(maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.EventoId);
            
            CreateTable(
                "CR.tab_OportunidadNegocios",
                c => new
                    {
                        OportunidadNegocioId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(nullable: false),
                        NombreOportunidad = c.String(nullable: false, maxLength: 250),
                        FechaMaximaAtencion = c.DateTime(nullable: false),
                        EventoId = c.Int(),
                        ContactoId = c.Int(),
                        Fecha = c.DateTime(nullable: false),
                        EstadoOportunidad = c.String(),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                    })
                .PrimaryKey(t => t.OportunidadNegocioId)
                .ForeignKey("CR.cat_Contactos", t => t.ContactoId)
                .ForeignKey("CR.tab_Eventos", t => t.EventoId)
                .Index(t => t.EventoId)
                .Index(t => t.ContactoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_OportunidadNegocios", "EventoId", "CR.tab_Eventos");
            DropForeignKey("CR.tab_OportunidadNegocios", "ContactoId", "CR.cat_Contactos");
            DropIndex("CR.tab_OportunidadNegocios", new[] { "ContactoId" });
            DropIndex("CR.tab_OportunidadNegocios", new[] { "EventoId" });
            DropTable("CR.tab_OportunidadNegocios");
            DropTable("CR.tab_Eventos");
        }
    }
}
