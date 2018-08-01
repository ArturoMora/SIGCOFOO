namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevosCamposRequeridosMediosNotificacion : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "MedioComunicacion", c => c.String(maxLength: 250));
            AddColumn("CR.tab_OportunidadNegocios", "Notificar", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "Notificar");
            DropColumn("CR.tab_OportunidadNegocios", "MedioComunicacion");
        }
    }
}
