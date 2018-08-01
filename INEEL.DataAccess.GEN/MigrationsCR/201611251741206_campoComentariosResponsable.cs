namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class campoComentariosResponsable : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "ComentariosResponsable", c => c.String(unicode: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_OportunidadNegocios", "ComentariosResponsable");
        }
    }
}
