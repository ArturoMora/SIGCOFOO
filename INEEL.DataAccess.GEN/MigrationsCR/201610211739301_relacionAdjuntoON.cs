namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class relacionAdjuntoON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "AdjuntoId", c => c.Long());
            AlterColumn("CR.tab_OportunidadNegocios", "FechaMaximaAtencion", c => c.DateTime());
            CreateIndex("CR.tab_OportunidadNegocios", "AdjuntoId");
            AddForeignKey("CR.tab_OportunidadNegocios", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_OportunidadNegocios", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CR.tab_OportunidadNegocios", new[] { "AdjuntoId" });
            AlterColumn("CR.tab_OportunidadNegocios", "FechaMaximaAtencion", c => c.DateTime(nullable: false));
            DropColumn("CR.tab_OportunidadNegocios", "AdjuntoId");
        }
    }
}
