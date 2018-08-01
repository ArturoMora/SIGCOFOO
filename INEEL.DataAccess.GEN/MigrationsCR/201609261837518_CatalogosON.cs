namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CatalogosON : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_TiposEventos",
                c => new
                    {
                        TipoEventoONId = c.Int(nullable: false, identity: true),
                        NombreEvento = c.String(nullable: false, maxLength: 200),
                        FechaAlta = c.DateTime(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoEventoONId);
            
            AddColumn("CR.tab_Eventos", "TipoEventoONId", c => c.Int(nullable: false));
            AddColumn("CR.tab_Eventos", "Ciudad", c => c.String(maxLength: 250));
            AddColumn("CR.tab_Eventos", "FechaEvento", c => c.DateTime(nullable: false));
            CreateIndex("CR.tab_Eventos", "TipoEventoONId");
            AddForeignKey("CR.tab_Eventos", "TipoEventoONId", "CR.tab_TiposEventos", "TipoEventoONId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_Eventos", "TipoEventoONId", "CR.tab_TiposEventos");
            DropIndex("CR.tab_Eventos", new[] { "TipoEventoONId" });
            DropColumn("CR.tab_Eventos", "FechaEvento");
            DropColumn("CR.tab_Eventos", "Ciudad");
            DropColumn("CR.tab_Eventos", "TipoEventoONId");
            DropTable("CR.tab_TiposEventos");
        }
    }
}
